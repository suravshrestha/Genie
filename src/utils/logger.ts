import * as vscode from "vscode";

// Create output channel (for debugging) as console.log does not work
let outputChannel = vscode.window.createOutputChannel("Genie");

// For printing normal log messages
const log = (...params: any[]) => {
  for (const param of params) {
    outputChannel.appendLine(param);
  }
};

export { log };
