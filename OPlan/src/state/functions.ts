import { OutlineMap, Outline } from "./types";

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

export function normalize(tree: Outline): OutlineMap {
  return Object.assign(
    {
      [tree.id]: {
        ...tree,
        items: tree.subs.map((v) => v.id),
      },
    },
    ...tree.subs.map(normalize)
  );
}
