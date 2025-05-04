import opml from "opml";
import { OutlineMap, Outline, JsonForXml } from "./types";

export function denormalize(norm: OutlineMap): Outline[] {
  // make Trees with no children
  const treeHash: Record<string, Outline> = Object.fromEntries(
    Object.entries(norm).map(([k, v]) => [k, { ...v, subs: [] }])
  );
  // keep track of trees with no parents
  const parentlessTrees = Object.fromEntries(
    Object.entries(norm).map(([k, v]) => [k, true])
  );
  Object.values(norm).forEach((v) => {
    // hook up children
    treeHash[v.id].subs = v.items ? v.items.map((k) => treeHash[k]) : [];
    // trees that are children do have parents, remove from parentlessTrees
    v.items.forEach((k) => delete parentlessTrees[k]);
  });
  const parentlessTreeIds = Object.keys(parentlessTrees);
  const parentlessOutlines = parentlessTreeIds.map((id) => treeHash[id]);
  return parentlessOutlines;
}

export function normalize(outline: Outline): OutlineMap {
  const isSubsDefined = outline.subs !== undefined;
  const outlinesRecursive = isSubsDefined ? outline.subs.map(normalize) : [];
  const resp = Object.assign(
    {
      [outline.id]: {
        ...outline,
        items: isSubsDefined ? outline.subs.map((v) => v.id) : [],
        subs: isSubsDefined ? outline.subs : [],
      },
    },
    ...outlinesRecursive
  );
  return resp;
}

export function unbeautifyXml(xml: string) {
  xml = xml.replace(/>\s*/g, ">"); // Replace "> " with ">"
  xml = xml.replace(/\s*</g, "<"); // Replace "< " with "<"
  return xml;
}

export function asOpmlJson(title: string, outlines: Outline[]): JsonForXml {
  return {
    opml: {
      head: { title: title },
      body: { subs: outlines },
    },
  };
}

export function toXml(json: {}): string {
  if (!json) {
    return "";
  }
  const xmlRaw = opml.stringify(json);
  const xml = xmlRaw.replace(
    new RegExp('encoding="ISO-8859-1"'),
    'encoding="UTF-8"'
  );
  return xml;
}

export function updatePosition(
  array: string[],
  fromIndex: number,
  element: string
) {
  console.log(array, "fromIndex: ", fromIndex, "element:", element);

  const filtered = array.filter((ind) => {
    return ind !== element;
  });

  return filtered;
}

export function moveElementForwardsByOne(element1: string, array: string[]) {
  const index: number = array.indexOf(element1);
  if (index !== -1 && index - 1 > -1) {
    return moveElement(array, index, index - 1);
  } else {
    return array;
  }
}

export function moveElementBackwardsByOne(element1: string, array: string[]) {
  const index: number = array.indexOf(element1);
  if (index !== -1 && index + 1 !== array.length) {
    return moveElement(array, index, index + 1);
  } else {
    return array;
  }
}

function moveElement(arr: string[], fromIndex: number, toIndex: number) {
  return arr.map((item, index) => {
    if (index === toIndex) return arr[fromIndex];
    if (index === fromIndex) return arr[toIndex];
    return item;
  });
}
