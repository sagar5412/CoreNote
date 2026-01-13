import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";

const BulletListComponent = () => {
  return (
    <NodeViewWrapper>
      <ul className="list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square] pl-6 my-2 space-y-1">
        <NodeViewContent />
      </ul>
    </NodeViewWrapper>
  );
};

const ListItemComponent = () => {
  return (
    <NodeViewWrapper as="li" className="leading-relaxed">
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const CustomBulletList = BulletList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BulletListComponent, {
      className: "custom-bulletlist-node",
    });
  },
});

export const CustomListItem = ListItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ListItemComponent, {
      className: "custom-listitem-node",
    });
  },
});
