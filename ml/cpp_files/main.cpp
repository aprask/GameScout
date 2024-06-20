#include <iostream>


void squareNum(int* num) {
    *num *= *num;
}

int main() {
    int number = 5;
    squareNum(&number);
    std::cout << number << std::endl;
    return 0;
}