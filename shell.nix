let
  nixpkgs = import <nixpkgs> {};
in
  with nixpkgs;

  stdenv.mkDerivation {
    name = "nyanbooru";
    buildInputs = [
      nodejs-16_x
    ];
  }