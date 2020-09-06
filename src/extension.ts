/**
 * File: extension.ts
 * Created at: 03/30/19, 01:54:00
 * Created by: Kunal Gursahani
 * Last Modified: 03/31/19, 02:10:47 
 * ------
 * Description: 
 * CPP search documentation
 * 
 */


import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let currentDoc: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('docs.start', () => {
      if (currentDoc) {
        currentDoc.reveal(vscode.ViewColumn.Beside);
        currentDoc.webview.html = getWebviewContent();
      } else {
        currentDoc = vscode.window.createWebviewPanel(
          'docs',
          'Search cplusplus documentation',
          {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: false
          },
          {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true
          }
        );
        vscode.window.setStatusBarMessage("Search cplusplus reference");
        currentDoc.webview.html = getWebviewContent();
        currentDoc.onDidDispose(() => {
          currentDoc = undefined;
        }, null, context.subscriptions);
      }
    })
  );
}

function getWebviewContent() {
  const active = vscode.window.activeTextEditor;
  let site = 'http://www.cplusplus.com/';
  if (!active.selection.isEmpty) {
    site += 'search.do?q=';
    site += encodeURIComponent(active.document.getText(active.selection));
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPP Documentation</title>
    <style>
        body, html
          {
            margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
          }
      </style>
</head>
<body>    
<iframe src="` + site + `" width="100%" height="100%" ></iframe>
</body>
</html>`;
} 
