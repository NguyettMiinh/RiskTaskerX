export type OptionValue = string | boolean;

export interface OptionType {
    label: string,
    value: OptionValue
}
export interface SelectType<T extends OptionValue> {
  options: OptionType[],
  allLabel: string,
  onChange: (value: T[]) => void,
  className?: string | null
}