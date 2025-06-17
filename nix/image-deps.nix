{ pkgs ? import <nixpkgs> {}, src ? ./. , created ? "" }:

let
  depsStage = import ./deps-stage.nix { inherit pkgs src created; };
in
pkgs.dockerTools.buildImage {
  name = "flatgas-deps";
  tag = "v0.1.0";

  # Include the output of deps-stage
  contents = [
    depsStage
    pkgs.nodejs_22
    pkgs.yarn
    pkgs.bash
    pkgs.coreutils
    pkgs.findutils
    pkgs.gnugrep
    pkgs.less
    pkgs.curl
    pkgs.git
    pkgs.cacert
    pkgs.patchelf  # 👈 add this
  ];

  config = {
    WorkingDir = "/flatgas";
    Env = [
      "NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
      "PATH=${pkgs.coreutils}/bin:${pkgs.nodejs_22}/bin:${pkgs.yarn}/bin:/bin:/usr/bin"
    ];
    Cmd = [ "sh" ];
  };
}
