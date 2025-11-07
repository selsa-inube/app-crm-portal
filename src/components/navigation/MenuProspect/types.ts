interface IOptions {
  title: string;
  onClick: () => void;
  icon: JSX.Element;
  visible: boolean;
  id?: string;
}

export type { IOptions };
