#pragma once
#include <string>
#include <iostream>
#include <string_view>
#include <arrow/csv/api.h>
#include <arrow/api.h>
#include <arrow/csv/reader.h>
#include <arrow/io/api.h>
#include <memory>
#include <filesystem>

class DataCollection {
public:
    DataCollection();
    ~DataCollection();
protected:
    int collectData(std::shared_ptr<arrow::Table>& table);
    static void displayTable(const std::shared_ptr<arrow::Table>& table);
    [[nodiscard]] int getRows() const;
    [[nodiscard]] int getColumns() const;
    std::string getPath();
    void setRows(int& rows);
    void setColumns(int& columns);
    void setPath(std::string_view path);
private:
    arrow::Status readCsv(std::shared_ptr<arrow::csv::TableReader>& reader);
    static arrow::Status createTable(std::shared_ptr<arrow::csv::TableReader>& reader, std::shared_ptr<arrow::Table>& table);
    int fileExists();
    std::string csvPath;
    int numRows;
    int numColumns;
};