#pragma once
#include <string>
#include <iostream>
#include <string_view>
#include <arrow/csv/api.h>
#include <arrow/api.h>
#include <memory>

class DataCollection {
public:
    DataCollection();
    ~DataCollection();
protected:
    int createTable(std::shared_ptr<arrow::Table>& table);
    void displayTable(std::shared_ptr<arrow::Table> table);
private:
    int getCsv(arrow::Status& status);
    std::string csvPath;
    int numRows;
    int numColumns;
};