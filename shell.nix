let
  nixpkgs = import <nixpkgs> {};
in
  with nixpkgs;

  stdenv.mkDerivation {
    name = "danboonyan";
    buildInputs = [
      nodejs-16_x
    ];
  }