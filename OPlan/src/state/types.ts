export type OPlanState = {
  outlines: OutlineMap;
  showXml: boolean;
  topOutlineOrder: Number[];
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
