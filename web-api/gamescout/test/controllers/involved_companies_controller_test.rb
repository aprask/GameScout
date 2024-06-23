require "test_helper"

class InvolvedCompaniesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @involved_company = involved_companies(:one)
  end

  test "should get index" do
    get involved_companies_url
    assert_response :success
  end

  test "should get new" do
    get new_involved_company_url
    assert_response :success
  end

  test "should create involved_company" do
    assert_difference("InvolvedCompany.count") do
      post involved_companies_url, params: { involved_company: { company_id: @involved_company.company_id, company_name: @involved_company.company_name, developer: @involved_company.developer, game_id: @involved_company.game_id, publisher: @involved_company.publisher } }
    end

    assert_redirected_to involved_company_url(InvolvedCompany.last)
  end

  test "should show involved_company" do
    get involved_company_url(@involved_company)
    assert_response :success
  end

  test "should get edit" do
    get edit_involved_company_url(@involved_company)
    assert_response :success
  end

  test "should update involved_company" do
    patch involved_company_url(@involved_company), params: { involved_company: { company_id: @involved_company.company_id, company_name: @involved_company.company_name, developer: @involved_company.developer, game_id: @involved_company.game_id, publisher: @involved_company.publisher } }
    assert_redirected_to involved_company_url(@involved_company)
  end

  test "should destroy involved_company" do
    assert_difference("InvolvedCompany.count", -1) do
      delete involved_company_url(@involved_company)
    end

    assert_redirected_to involved_companies_url
  end
end
