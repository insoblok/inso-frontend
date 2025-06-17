{ pkgs ? import <nixpkgs> {}, fetchTarball ? builtins.fetchTarball }:

pkgs.mkShell {
  name = "inso-frontend-shell";

  buildInputs = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.git
    pkgs.docker
    pkgs.nix-prefetch-git
    (import (fetchTarball {
      url = "https://github.com/moretea/yarn2nix/archive/master.tar.gz";
      sha256 = "9Zv1rVX40DJZ9WiTdoNbjLlw0aijsaZfu5uaB/esN78=";
    }) {}).yarn2nix
  ];

  shellHook = ''
    echo "🟢 Welcome to the inso-frontend shell!"
    echo "💡 yarn2nix --lockfile yarn.lock --packageJSON package.json > yarn.nix"
    echo "🐳 Docker is available in this shell"
  '';
}
