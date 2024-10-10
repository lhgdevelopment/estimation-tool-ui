import {TextField} from "@mui/material";

type TTextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<any>)=>void;
  hasError: boolean;
};
export default function AppTextInput(props:TTextInputProps){
  const {onChange, value, name, label, hasError} = props;

return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={hasError}
      fullWidth
    />
  )
}
