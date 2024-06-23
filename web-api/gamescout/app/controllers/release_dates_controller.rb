class ReleaseDatesController < ApplicationController
  before_action :set_release_date, only: %i[ show edit update destroy ]

  # GET /release_dates or /release_dates.json
  def index
    @release_dates = ReleaseDate.all
  end

  # GET /release_dates/1 or /release_dates/1.json
  def show
  end

  # GET /release_dates/new
  def new
    @release_date = ReleaseDate.new
  end

  # GET /release_dates/1/edit
  def edit
  end

  # POST /release_dates or /release_dates.json
  def create
    @release_date = ReleaseDate.new(release_date_params)

    respond_to do |format|
      if @release_date.save
        format.html { redirect_to release_date_url(@release_date), notice: "Release date was successfully created." }
        format.json { render :show, status: :created, location: @release_date }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @release_date.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /release_dates/1 or /release_dates/1.json
  def update
    respond_to do |format|
      if @release_date.update(release_date_params)
        format.html { redirect_to release_date_url(@release_date), notice: "Release date was successfully updated." }
        format.json { render :show, status: :ok, location: @release_date }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @release_date.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /release_dates/1 or /release_dates/1.json
  def destroy
    @release_date.destroy

    respond_to do |format|
      format.html { redirect_to release_dates_url, notice: "Release date was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_release_date
      @release_date = ReleaseDate.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def release_date_params
      params.require(:release_date).permit(:human, :platform_id, :game_id)
    end
end
