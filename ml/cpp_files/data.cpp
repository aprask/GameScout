#include "data.h"

DataCollection::DataCollection() {
    csvPath = "../../wii.csv";
    numRows = 397;
    numColumns = 6;
}

int DataCollection::fileExists() {
    return std::filesystem::exists(csvPath);
}

arrow::Status DataCollection::readCsv(std::shared_ptr<arrow::csv::TableReader> &reader) {
    std::shared_ptr<arrow::io::ReadableFile> file;
    ARROW_ASSIGN_OR_RAISE(file, arrow::io::ReadableFile::Open(csvPath));
    arrow::csv::ReadOptions readOptions;
    arrow::csv::ParseOptions parseOptions;
    arrow::csv::ConvertOptions convertOptions;

    ARROW_ASSIGN_OR_RAISE(reader, arrow::csv::TableReader::Make(arrow::io::default_io_context(), file, readOptions, parseOptions, convertOptions));

    return arrow::Status::OK();
}

arrow::Status DataCollection::createTable(std::shared_ptr<arrow::csv::TableReader> &reader,
                                std::shared_ptr<arrow::Table> &table) {
    ARROW_ASSIGN_OR_RAISE(table, reader->Read());
    return arrow::Status::OK();
}

int DataCollection::collectData(std::shared_ptr<arrow::Table> &table) {
    if (!fileExists()) {
        std::cout << "Couldn't find the path to the csv file." << std::endl;
        return -1;
    }

    std::shared_ptr<arrow::csv::TableReader> tableReader;
    if (!readCsv(tableReader).ok()) {
        std::cout << "Couldn't read the contents of the csv file." << std::endl;
        return -1;
    }

    if (!createTable(tableReader, table).ok()) {
        std::cout << "Couldn't read the contents of the table reader into the table." << std::endl;
        return -1;
    }

    return (int) table->num_rows();
}

void DataCollection::displayTable(const std::shared_ptr<arrow::Table> &table) {
    std::cout << table->schema()->ToString() << std::endl;
}

int DataCollection::getRows() const {
    return numRows;
}

int DataCollection::getColumns() const {
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