import { atom, DefaultValue, RecoilState } from "recoil";

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: any) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export type TNoteState = Readonly<{
  id: number;
  title: string;
  content: string;
}>;

const noteStoreAtom = atom<Array<TNoteState>>({
  key: "noteStoreAtom", // unique ID (with respect to other atoms/selectors)
  default: [],
  effects_UNSTABLE: [localStorageEffect("noteStoreAtomPersist")]
});

type TAtomsExport = Readonly<{
  noteStoreAtom: RecoilState<Array<TNoteState>>;
}>;

const Atoms: TAtomsExport = {
  noteStoreAtom
};

export default Atoms;
