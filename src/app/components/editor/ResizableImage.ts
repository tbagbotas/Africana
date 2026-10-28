import Image from "@tiptap/extension-image";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: "100%",
      },

      class: {
        default: "rounded-lg",
      },
    };
  },
});

export default ResizableImage;