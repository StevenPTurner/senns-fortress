import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface ConfigPanelProps {
  lowQualityListsHidden: boolean,
  onLowQualityCheckboxChange: Function
}

export default function ConfigPanel({ lowQualityListsHidden, onLowQualityCheckboxChange }: ConfigPanelProps) {
  const handleHideLowQualityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLowQualityCheckboxChange(event.target.checked);
  }

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      display: 'flex'
    }}>
      <FormControl sx={{
        margin: "10px 0px 10px 20px"
      }}>
        <FormLabel sx={{
          fontWeight: 'bold'
        }}
          component="legend">Config</FormLabel>
        <FormGroup>
          <FormControlLabel control={
            <Checkbox
              defaultChecked
              checked={lowQualityListsHidden}
              onChange={handleHideLowQualityChange}
            />
          } label="Hide low quality lists" />
        </FormGroup>
      </FormControl>
    </Box>
  );
}