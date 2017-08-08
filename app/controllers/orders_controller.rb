class OrdersController < ApplicationController
	 skip_before_filter :verify_authenticity_token  

	def index
    @orders = Order.all
    respond_to do |format|
      format.html
      format.json { render :json => @orders }
    end
  end


   def create
    @order = Order.new(order_params)
    respond_to do |format|
      format.json do 
        if @order.save
          render :json => @order
        else
          render :json => { :errors => @order.errors.messages }, :status => 422
        end
      end
    end
  end


 def update
    @order = Order.find(params[:id])
    respond_to do |format|
      format.json do 
        if @order.update(order_params)
          render :json => @order
        else
          render :json => { :errors => @order.errors.messages }, :status => 422
        end
      end
    end
  end

  def destroy
    Order.find(params[:id]).destroy
    respond_to do |format|
      format.json { render :json => { :id => params[:id]}, :status => 200 }
    end
  end

  private

  def order_params
    params.require(:order).permit(:pedido, :persona, :manager)
  end


end
