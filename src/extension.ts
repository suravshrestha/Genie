// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { document } from "./services/document";

import { log } from "./utils/logger";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Track the current panel with a webview
  let panel: vscode.WebviewPanel | undefined = undefined;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const documentCode = vscode.commands.registerCommand("genie.document", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    // Create and show a new webview
    panel = vscode.window.createWebviewPanel(
      "Genie", // Identifies the type of the webview. Used internally
      "Document", // Title of the panel displayed to the user
      {
        preserveFocus: true, // new webview panel will not take focus
        viewColumn: vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
      },
    );

    const updateWebview = async () => {
      if (!panel) {
        return;
      }

      try {
        const documentedCode = await document(
          vscode.window.activeTextEditor?.document.getText() || "",
        );

        log("Documented Code:", documentedCode);

        // Set its HTML content
        // Send the content of the active file, from where the command was invoked to the webview
        // but also preserve the formatting from the original file
        panel.webview.html = getWebviewContent(documentedCode);
      } catch (error) {
        log("Error updating webview:", error);
      }
    };

    updateWebview();
  });

  context.subscriptions.push(documentCode);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(content: string) {
  return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Cat Coding</title>
		</head>

		<body>
			<pre>${content}</pre>
		</body>
	</html>`;
}
