// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getModelResponse } from "./services/gpt";

import { log } from "./utils/logger";

const createWebviewPanel = (panelTitle: string) => {
  // Create and show a new webview
  const panel = vscode.window.createWebviewPanel(
    "Genie", // Identifies the type of the webview. Used internally
    panelTitle, // Title of the panel displayed to the user
    {
      preserveFocus: true, // new webview panel will not take focus
      viewColumn: vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
    },
  );

  return panel;
};

const updateWebview = async (panel: vscode.WebviewPanel, action: string) => {
  if (!panel) {
    return;
  }

  try {
    const response = await getModelResponse(
      vscode.window.activeTextEditor?.document.getText() || "",
      action,
    );

    log(action);
    log(response);

    // Set its HTML content
    // Send the content of the active file, from where the command was invoked to the webview
    // but also preserve the formatting from the original file
    panel.webview.html = getWebviewContent(response);
  } catch (error) {
    log("Error updating webview:", error);
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
    // Display a message box to the user

    const panel: vscode.WebviewPanel = createWebviewPanel("Documented Code");

    updateWebview(panel, "document");
  });

  const explainCode = vscode.commands.registerCommand("genie.explain", () => {
    const panel: vscode.WebviewPanel = createWebviewPanel("Explained Code");

    updateWebview(panel, "explain");
  });

  const optimizeCode = vscode.commands.registerCommand("genie.optimize", () => {
    const panel: vscode.WebviewPanel = createWebviewPanel("Optimized Code");

    updateWebview(panel, "optimize");
  });

  const unitTests = vscode.commands.registerCommand("genie.unitTest", () => {
    const panel: vscode.WebviewPanel = createWebviewPanel("Unit Tests");

    updateWebview(panel, "unit-test");
  });

  context.subscriptions.push(
    documentCode,
    explainCode,
    optimizeCode,
    unitTests,
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(content: string) {
  // Replace < and > with HTML entities
  content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
		</head>

		<body>
			<pre>${content}</pre>
		</body>
	</html>`;
}
