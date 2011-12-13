require 'rubygems'
require 'bundler/setup'

require 'sinatra/base'

class NASA
	
end

class GroundStationApp < Sinatra::Base
	
	configure do
		enable :logging
		enable :static
	end

	get '/' do
		'Hello, world'
	end

end
