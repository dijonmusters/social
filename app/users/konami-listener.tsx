"use client";

import { useKonami } from "react-konami-code";
import { followAllUsers } from "../actions";

export default function KonamiListener() {
  useKonami(() => {
    followAllUsers();
  });
  return <div />;
}
