import * as vscode from "vscode";

export async function getApiKey() {
  const config = vscode.workspace.getConfiguration("genie");
  let apiKey = config?.apiKey?.trim();

  if (!apiKey) {
    apiKey = await vscode.window.showInputBox({
      prompt: "Genie: OpenAI API Key is not configured. Please enter your OpenAI API key.",
      ignoreFocusOut: true, // Allows the input box to stay open even if focus moves outside VS Code
    });

    if (!apiKey) {
      vscode.window.showErrorMessage("Genie: OpenAI API Key is required. Unable to proceed.");
      return "";
    }

    // Save the entered API key to the configuration
    await config.update("apiKey", apiKey, vscode.ConfigurationTarget.Global);
  }

  return apiKey;
}
