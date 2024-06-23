require "application_system_test_case"

class ScreenshotsTest < ApplicationSystemTestCase
  setup do
    @screenshot = screenshots(:one)
  end

  test "visiting the index" do
    visit screenshots_url
    assert_selector "h1", text: "Screenshots"
  end

  test "should create screenshot" do
    visit screenshots_url
    click_on "New screenshot"

    fill_in "Game", with: @screenshot.game_id
    fill_in "Url", with: @screenshot.url
    click_on "Create Screenshot"

    assert_text "Screenshot was successfully created"
    click_on "Back"
  end

  test "should update Screenshot" do
    visit screenshot_url(@screenshot)
    click_on "Edit this screenshot", match: :first

    fill_in "Game", with: @screenshot.game_id
    fill_in "Url", with: @screenshot.url
    click_on "Update Screenshot"

    assert_text "Screenshot was successfully updated"
    click_on "Back"
  end

  test "should destroy Screenshot" do
    visit screenshot_url(@screenshot)
    click_on "Destroy this screenshot", match: :first

    assert_text "Screenshot was successfully destroyed"
  end
end
