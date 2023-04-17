export interface Tag {
  type: "tag-word";
  label: string;
  value: string;
  category: 0;
  post_count: number;
  antecedent?: string; // The tag that this tag is an alias of
}
