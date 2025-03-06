export type OPlanState = {
  title: string;
  outlines: OutlineMap;
  showXml: boolean;
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
  subs: Outline[];
}

export type JsonForXml = {
  opml: {
    head: { title: string };
    body: { subs: Outline[] };
  };
};
