export interface NavItemPlanner {
  displayName?: string;
  disabled?: boolean;
  external?: boolean;
  twoLines?: boolean;
  chip?: boolean;
  iconName?: string;
  navCap?: string;
  chipContent?: string;
  chipClass?: string;
  subtext?: string;
  route?: string;
  children?: NavItemPlanner[];
  ddType?: string;
  visible?: boolean;
  roles?: string[];
}
