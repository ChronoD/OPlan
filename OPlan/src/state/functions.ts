import { OutlineMap, Outline } from "./types";

export function denormalize(norm: OutlineMap): Outline {
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
    treeHash[v.id].subs = v.items.map((k) => treeHash[k]);
    // trees that are children do have parents, remove from parentlessTrees
    v.items.forEach((k) => delete parentlessTrees[k]);
  });

  const parentlessTreeIds = Object.keys(parentlessTrees);
  if (parentlessTreeIds.length !== 1)
    throw new Error(
      "uh oh, there are " +
        parentlessTreeIds.length +
        " parentless trees, but there should be exactly 1"
    );
  return treeHash[parentlessTreeIds[0]];
}

export function normalize(outline: Outline): OutlineMap {
  const isSubsDefined = outline.subs !== undefined;
  const outlinesRecursive = isSubsDefined ? outline.subs.map(normalize) : [];
  return Object.assign(
    {
      [outline.id]: {
        ...outline,
        items: isSubsDefined ? outline.subs.map((v) => v.id) : [],
        subs: isSubsDefined ? outline.subs : [],
      },
    },
    ...outlinesRecursive
  );
}

export function unbeautifyXml(xml: string) {
  xml = xml.replace(/>\s*/g, ">"); // Replace "> " with ">"
  xml = xml.replace(/\s*</g, "<"); // Replace "< " with "<"
  return xml;
}
