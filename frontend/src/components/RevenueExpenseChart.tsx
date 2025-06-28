import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface RevenueExpenseChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: '#F8FAFC', mb: 1, fontWeight: 500 }}
        >
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: entry.color,
              fontSize: '0.875rem',
            }}
          >
            {entry.name}: ${entry.value.toFixed(2)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export const RevenueExpenseChart: React.FC<RevenueExpenseChartProps> = ({ data }) => {
  const [period, setPeriod] = React.useState('monthly');

  const handlePeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriod: string,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: '#1E293B',
        border: '1px solid #334155',
        borderRadius: 3,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
            }}
          >
            Overview
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  Income
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  Expenses
                </Typography>
              </Box>
            </Box>

            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  backgroundColor: 'transparent',
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: '#334155',
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  },
                },
              }}
            >
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#22C55E', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
