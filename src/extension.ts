// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { getModelResponse } from "./services/gpt";
import { log } from "./utils/logger";
import { testingLibraries } from "./utils/constants";

const showOutput = async (action: string, testingLibrary?: string) => {
  const document = vscode.window.activeTextEditor?.document;

  if (!document || !document.getText()) {
    return;
  }

  try {
    const response = await getModelResponse(
      document.getText(),
      action,
      testingLibrary,
    );

    vscode.window.showInformationMessage("Genie: Generating output...");

    log(action);
    log(response);

    vscode.workspace
      .openTextDocument({
        content: response,
        language: document.languageId,
      })
      .then((doc) => {
        vscode.window.showTextDocument(doc, {
          viewColumn: vscode.ViewColumn.Beside, // Editor column to show the text document panel in.
          preserveFocus: true, // new text document panel will not take focus
        });
      });
  } catch (error) {
    vscode.window.showErrorMessage(
      "Genie: An error occurred while generating output",
    );

    log("Error in showOutput:", error);
  }
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const documentCode = vscode.commands.registerCommand("genie.document", () => {
    // The code you place here will be executed every time your command is executed
    showOutput("document");
  });

  const explainCode = vscode.commands.registerCommand("genie.explain", () => {
    showOutput("explain");
  });

  const optimizeCode = vscode.commands.registerCommand("genie.optimize", () => {
    showOutput("optimize");
  });

  const unitTests = vscode.commands.registerCommand(
    "genie.unitTest",
    async () => {
      const languageId: string =
        vscode.window.activeTextEditor?.document.languageId || "";

      if (!languageId) {
        vscode.window.showErrorMessage("No language found for this file");
        return;
      }

      const testingFrameworksObj = testingLibraries[languageId];

      if (!testingFrameworksObj) {
        showOutput("unit-test");

        return;
      }

      const selectedTestingLibrary = await vscode.window.showQuickPick(
        testingLibraries[languageId],
      );

      if (selectedTestingLibrary) {
        showOutput("unit-test", selectedTestingLibrary);
      }
    },
  );

  context.subscriptions.push(
    documentCode,
    explainCode,
    optimizeCode,
    unitTests,
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
