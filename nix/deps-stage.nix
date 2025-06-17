{ pkgs ? import <nixpkgs> {}, src ? ./. , created ? "" }:

pkgs.stdenv.mkDerivation {
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
    pkgs.cacert# TLS root certs
    pkgs.patchelf  # 👈 add this

  ];

  buildPhase = ''
    export PYTHON=python3
    export NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
    export HOME=$(mktemp -d)
    export HUSKY=0

    mkdir -p app
    cd app
    cp $src/package.json $src/yarn.lock $src/tsconfig.json ./
    cp -r $src/types $src/lib ./
    mkdir -p configs
    cp -r $src/configs/app ./configs/app
    mkdir -p toolkit/components/forms/validators
    cp -r $src/toolkit/theme $src/toolkit/utils ./toolkit/
    cp $src/toolkit/components/forms/validators/url.ts ./toolkit/components/forms/validators/
    yarn install --frozen-lockfile --network-timeout 100000
    cd ..

    mkdir -p feature-reporter
    cd feature-reporter
    cp $src/deploy/tools/feature-reporter/package.json .
    cp $src/deploy/tools/feature-reporter/yarn.lock .
    yarn install --frozen-lockfile --network-timeout 100000
    cd ..

    mkdir -p envs-validator
    cd envs-validator
    cp $src/deploy/tools/envs-validator/package.json .
    cp $src/deploy/tools/envs-validator/yarn.lock .
    yarn install --frozen-lockfile --network-timeout 100000
    cd ..

    mkdir -p favicon-generator
    cd favicon-generator
    cp $src/deploy/tools/favicon-generator/package.json .
    cp $src/deploy/tools/favicon-generator/yarn.lock .
    yarn install --frozen-lockfile --network-timeout 100000
    cd ..

    mkdir -p sitemap-generator
    cd sitemap-generator
    cp $src/deploy/tools/sitemap-generator/package.json .
    cp $src/deploy/tools/sitemap-generator/yarn.lock .
    yarn install --frozen-lockfile --network-timeout 100000
    cd ..
  '';

  installPhase = ''
    mkdir -p $out
    cp -r . $out/
  '';
}
