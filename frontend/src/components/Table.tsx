import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { colors, typography, borderRadius, spacing } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);

interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  loadingClassName?: string;
  emptyClassName?: string;
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyText = 'Brak danych',
  className = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  loadingClassName = '',
  emptyClassName = '',
}: TableProps<T>) {
  // Base classes
  let containerClasses = 'border border-border rounded-lg overflow-hidden';
  let headerClasses = 'flex-row bg-secondary border-b border-border py-md';
  let rowClasses = 'flex-row border-b border-border py-md';
  let cellClasses = 'px-md justify-center';
  let loadingClasses = 'py-lg items-center justify-center';
  let emptyClasses = 'py-lg items-center justify-center';
  
  // Add custom classes
  containerClasses += ` ${className}`;
  headerClasses += ` ${headerClassName}`;
  rowClasses += ` ${rowClassName}`;
  cellClasses += ` ${cellClassName}`;
  loadingClasses += ` ${loadingClassName}`;
  emptyClasses += ` ${emptyClassName}`;
  
  const renderHeader = () => (
    <StyledView className={headerClasses}>
      {columns.map((column, index) => (
        <StyledView 
          key={index} 
          className={cellClasses}
          style={{ width: column.width || `${100 / columns.length}%` }}
        >
          <StyledText className="font-bold text-textPrimary">{column.title}</StyledText>
        </StyledView>
      ))}
    </StyledView>
  );
  
  const renderRow = ({ item }: { item: T }) => (
    <StyledView className={rowClasses}>
      {columns.map((column, index) => {
        const key = column.key as string;
        return (
          <StyledView 
            key={index} 
            className={cellClasses}
            style={{ width: column.width || `${100 / columns.length}%` }}
          >
            {column.render ? (
              column.render(item)
            ) : (
              <StyledText className="text-textPrimary">
                {item[key as keyof T]?.toString() || ''}
              </StyledText>
            )}
          </StyledView>
        );
      })}
    </StyledView>
  );
  
  if (loading) {
    return (
      <StyledView className={containerClasses}>
        {renderHeader()}
        <StyledView className={loadingClasses}>
          <ActivityIndicator size="large" color={colors.primary} />
          <StyledText className="text-textSecondary mt-sm">Ładowanie...</StyledText>
        </StyledView>
      </StyledView>
    );
  }
  
  if (data.length === 0) {
    return (
      <StyledView className={containerClasses}>
        {renderHeader()}
        <StyledView className={emptyClasses}>
          <StyledText className="text-textSecondary">{emptyText}</StyledText>
        </StyledView>
      </StyledView>
    );
  }
  
  return (
    <StyledView className={containerClasses}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
      />
    </StyledView>
  );
}

export default Table;


