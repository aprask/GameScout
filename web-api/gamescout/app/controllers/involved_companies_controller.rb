class InvolvedCompaniesController < ApplicationController
  before_action :set_involved_company, only: %i[ show edit update destroy ]

  # GET /involved_companies or /involved_companies.json
  def index
    @involved_companies = InvolvedCompany.all
  end

  # GET /involved_companies/1 or /involved_companies/1.json
  def show
  end

  # GET /involved_companies/new
  def new
    @involved_company = InvolvedCompany.new
  end

  # GET /involved_companies/1/edit
  def edit
  end

  # POST /involved_companies or /involved_companies.json
  def create
    @involved_company = InvolvedCompany.new(involved_company_params)

    respond_to do |format|
      if @involved_company.save
        format.html { redirect_to involved_company_url(@involved_company), notice: "Involved company was successfully created." }
        format.json { render :show, status: :created, location: @involved_company }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @involved_company.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /involved_companies/1 or /involved_companies/1.json
  def update
    respond_to do |format|
      if @involved_company.update(involved_company_params)
        format.html { redirect_to involved_company_url(@involved_company), notice: "Involved company was successfully updated." }
        format.json { render :show, status: :ok, location: @involved_company }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @involved_company.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /involved_companies/1 or /involved_companies/1.json
  def destroy
    @involved_company.destroy

    respond_to do |format|
      format.html { redirect_to involved_companies_url, notice: "Involved company was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_involved_company
      @involved_company = InvolvedCompany.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def involved_company_params
      params.require(:involved_company).permit(:company_id, :company_name, :developer, :publisher, :game_id)
    end
end
