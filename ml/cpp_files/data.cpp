#include "data.h"

DataCollection::DataCollection() {
    csvPath = "../../wii.csv";
    numRows = 397;
    numColumns = 6;
}

int DataCollection::fileExists() {
    return std::filesystem::exists(csvPath);
}

int DataCollection::createTable(std::shared_ptr<arrow::Table> &table) {
    return 0;
}

void DataCollection::displayTable(const std::shared_ptr<arrow::Table> &table) {
    std::cout << table << std::endl;
}

int DataCollection::getCsv(std::shared_ptr<arrow::csv::TableReader> &reader) {
    return 0;
}

int DataCollection::getRows() {
    return numRows;
}

int DataCollection::getColumns() {
    return numColumns;
}

std::string DataCollection::getPath() {
    return csvPath;
}

void DataCollection::setRows(int &rows) {
    numRows = rows;
}

void DataCollection::setColumns(int &columns) {
    numColumns = columns;
}

void DataCollection::setPath(std::string_view path) {
    csvPath = path;
}

DataCollection::~DataCollection() = default;