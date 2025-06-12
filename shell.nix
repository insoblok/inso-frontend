# shell.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "inso-frontend-shell";

  buildInputs = [
    pkgs.nodejs_20       # match runtime (same as in your `insoscope`)
    pkgs.yarn            # optional, in case you prefer yarn over npm
    pkgs.git             # always good to have
  ];

  shellHook = ''
    echo "🟢 Welcome to the inso-frontend shell!"
    echo "💡 Use 'yarn install' to install dependencies"
    echo "💡 Run 'yarn dev --port 3000' to start the frontend locally"
  '';
}
