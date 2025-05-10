export type OPlanState = {
  outlines: OutlineMap;
  showXml: boolean;
  importXml: string | null;
  importEnabled: boolean;
  topOutlineOrder: string[];
  title: string;
};

export interface OutlineMap {
  [k: string]: NormalizedOutline;
}

export interface NormalizedOutline {
  id: string;
  text: string | undefined;
  _note: string | undefined;
  items: string[];
}

export interface OutlineRaw {
  id: string | undefined;
  text: string | undefined;
  _note: string | undefined;
  subs: Outline[];
}

export interface Outline {
  id: string;
  text: string | undefined;
  _note: string | undefined;
  items: string[];
  subs: Outline[];
}

export type JsonForXml = {
  opml: {
    head: { title: string };
    body: { subs: Outline[] };
  };
};

export type OpmlJson = {
  opml: {
    head: { title: string };
    body: { subs: Outline[] };
  };
};
