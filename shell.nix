# shell.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "inso-frontend-shell";

  buildInputs = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.git
    pkgs.docker
  ];

  shellHook = ''
    echo "🟢 Welcome to the inso-frontend shell!"
    echo "💡 Use 'yarn install' to install dependencies"
    echo "💡 Run 'yarn dev --port 3000' to start the frontend locally"
    echo "🐳 Docker is available in this shell"
  '';
}
