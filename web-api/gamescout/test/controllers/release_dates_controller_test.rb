require "test_helper"

class ReleaseDatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @release_date = release_dates(:one)
  end

  test "should get index" do
    get release_dates_url
    assert_response :success
  end

  test "should get new" do
    get new_release_date_url
    assert_response :success
  end

  test "should create release_date" do
    assert_difference("ReleaseDate.count") do
      post release_dates_url, params: { release_date: { game_id: @release_date.game_id, human: @release_date.human, platform_id: @release_date.platform_id } }
    end

    assert_redirected_to release_date_url(ReleaseDate.last)
  end

  test "should show release_date" do
    get release_date_url(@release_date)
    assert_response :success
  end

  test "should get edit" do
    get edit_release_date_url(@release_date)
    assert_response :success
  end

  test "should update release_date" do
    patch release_date_url(@release_date), params: { release_date: { game_id: @release_date.game_id, human: @release_date.human, platform_id: @release_date.platform_id } }
    assert_redirected_to release_date_url(@release_date)
  end

  test "should destroy release_date" do
    assert_difference("ReleaseDate.count", -1) do
      delete release_date_url(@release_date)
    end

    assert_redirected_to release_dates_url
  end
end
