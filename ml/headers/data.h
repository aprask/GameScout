#pragma once
#include <string>
#include <iostream>
#include <string_view>
#include <arrow/csv/api.h>
#include <arrow/api.h>
#include <arrow/csv/reader.h>
#include <memory>
#include <filesystem>

class DataCollection {
public:
    DataCollection();
    ~DataCollection();
protected:
    int createTable(std::shared_ptr<arrow::Table>& table);
    void displayTable(const std::shared_ptr<arrow::Table>& table);
    int getRows();
    int getColumns();
    std::string getPath();
    void setRows(int& rows);
    void setColumns(int& columns);
    void setPath(std::string_view path);
private:
    int getCsv(std::shared_ptr<arrow::csv::TableReader>& reader);
    int fileExists();
    std::string csvPath;
    int numRows;
    int numColumns;
};