{ pkgs ? import <nixpkgs> {} }:

pkgs.dockerTools.buildImage {
  name = "insoscope-minimal";
  tag = "v0.0";
  created = "2025-06-17T12:00:00Z";

fromImage = pkgs.dockerTools.pullImage {
    imageName = "node";
    imageDigest = "sha256:b64ced2e7cd0a4816699fe308ce6e8a08ccba463c757c00c14cd372e3d2c763e";
    finalImageName = "node";
    finalImageTag = "22.11.0-alpine";
    sha256 = "sha256-bp5v4/shml+qm3hsXXeFP2ii7CCxKXd/gd5Gt0rK4o4=";
  };

  copyToRoot = pkgs.buildEnv {
    name = "image-root";
    paths = [
      pkgs.nodejs_20
      (pkgs.runCommand "app" { } ''
        mkdir -p $out
        cp ${./entrypoint.sh} $out/entrypoint.sh
        cp ${./server.js} $out/server.js
      '')
    ];
    pathsToLink = [ "/bin" ];
  };

  config = {
    Cmd = [ "node" "server.js" ];
    Entrypoint = [ "./entrypoint.sh" ];
    WorkingDir = "/";
  };
}
