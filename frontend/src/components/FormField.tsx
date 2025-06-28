import React from 'react';
import {
    TextField,
    IconButton,
    InputAdornment,
    FormControl,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    error?: string;
    isRequired?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = 'text',
    error,
    isRequired = false,
    onChange,
    value,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';

    return (
        <FormControl fullWidth>
            <TextField
                id={id}
                label={label}
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                value={value}
                onChange={onChange}
                required={isRequired}
                error={!!error}
                helperText={error}
                variant="outlined"
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#1E293B',
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#475569',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00D4FF',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                        '&.Mui-focused': {
                            color: '#00D4FF',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                        color: '#EF4444',
                    },
                }}
                InputProps={isPassword ? {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: '#94A3B8' }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                } : undefined}
            />
        </FormControl>
    );
};
