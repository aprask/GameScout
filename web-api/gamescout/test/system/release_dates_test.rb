require "application_system_test_case"

class ReleaseDatesTest < ApplicationSystemTestCase
  setup do
    @release_date = release_dates(:one)
  end

  test "visiting the index" do
    visit release_dates_url
    assert_selector "h1", text: "Release dates"
  end

  test "should create release date" do
    visit release_dates_url
    click_on "New release date"

    fill_in "Game", with: @release_date.game_id
    fill_in "Human", with: @release_date.human
    fill_in "Platform", with: @release_date.platform_id
    click_on "Create Release date"

    assert_text "Release date was successfully created"
    click_on "Back"
  end

  test "should update Release date" do
    visit release_date_url(@release_date)
    click_on "Edit this release date", match: :first

    fill_in "Game", with: @release_date.game_id
    fill_in "Human", with: @release_date.human
    fill_in "Platform", with: @release_date.platform_id
    click_on "Update Release date"

    assert_text "Release date was successfully updated"
    click_on "Back"
  end

  test "should destroy Release date" do
    visit release_date_url(@release_date)
    click_on "Destroy this release date", match: :first

    assert_text "Release date was successfully destroyed"
  end
end
