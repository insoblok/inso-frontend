{ pkgs ? import <nixpkgs> {}, src ? ./. , created ? "" }:

let
  yarnApp = pkgs.callPackage ./nix/yarn/app-yarn.nix {};

in pkgs.stdenv.mkDerivation {
  pname = "flatgas-web-deps";
  version = "0.1.0";

  inherit src;

  nativeBuildInputs = [
    pkgs.nodejs_22
    pkgs.yarn
    pkgs.bash
    pkgs.coreutils
    pkgs.findutils
    pkgs.gnugrep
    pkgs.less
    pkgs.curl
    pkgs.python3
    pkgs.gnumake
    pkgs.gcc
    pkgs.git
    pkgs.cacert
    pkgs.patchelf
  ];

  buildPhase = ''
    export PYTHON=python3
    export NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
    export HOME=$(mktemp -d)
    export HUSKY=0

    echo "🔧 Linking yarn2nix-generated node_modules..."

    mkdir -p app && cd app
    cp $src/package.json $src/yarn.lock .
    ln -s ${yarnApp}/node_modules ./node_modules
    cd ..

    mkdir -p feature-reporter && cd feature-reporter
    cp $src/deploy/tools/feature-reporter/package.json $src/deploy/tools/feature-reporter/yarn.lock .
    ln -s ${yarnFeatureReporter}/node_modules ./node_modules
    cd ..

    mkdir -p envs-validator && cd envs-validator
    cp $src/deploy/tools/envs-validator/package.json $src/deploy/tools/envs-validator/yarn.lock .
    ln -s ${yarnEnvsValidator}/node_modules ./node_modules
    cd ..

    mkdir -p favicon-generator && cd favicon-generator
    cp $src/deploy/tools/favicon-generator/package.json $src/deploy/tools/favicon-generator/yarn.lock .
    ln -s ${yarnFaviconGen}/node_modules ./node_modules
    cd ..

    mkdir -p sitemap-generator && cd sitemap-generator
    cp $src/deploy/tools/sitemap-generator/package.json $src/deploy/tools/sitemap-generator/yarn.lock .
    ln -s ${yarnSitemapGen}/node_modules ./node_modules
    cd ..
  '';

  installPhase = ''
    mkdir -p $out
    cp -r . $out/
  '';
}
