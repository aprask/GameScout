require "application_system_test_case"

class InvolvedCompaniesTest < ApplicationSystemTestCase
  setup do
    @involved_company = involved_companies(:one)
  end

  test "visiting the index" do
    visit involved_companies_url
    assert_selector "h1", text: "Involved companies"
  end

  test "should create involved company" do
    visit involved_companies_url
    click_on "New involved company"

    fill_in "Company", with: @involved_company.company_id
    fill_in "Company name", with: @involved_company.company_name
    check "Developer" if @involved_company.developer
    fill_in "Game", with: @involved_company.game_id
    check "Publisher" if @involved_company.publisher
    click_on "Create Involved company"

    assert_text "Involved company was successfully created"
    click_on "Back"
  end

  test "should update Involved company" do
    visit involved_company_url(@involved_company)
    click_on "Edit this involved company", match: :first

    fill_in "Company", with: @involved_company.company_id
    fill_in "Company name", with: @involved_company.company_name
    check "Developer" if @involved_company.developer
    fill_in "Game", with: @involved_company.game_id
    check "Publisher" if @involved_company.publisher
    click_on "Update Involved company"

    assert_text "Involved company was successfully updated"
    click_on "Back"
  end

  test "should destroy Involved company" do
    visit involved_company_url(@involved_company)
    click_on "Destroy this involved company", match: :first

    assert_text "Involved company was successfully destroyed"
  end
end
