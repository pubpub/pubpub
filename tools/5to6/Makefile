.phony:
	transform upload clean

transform:
	node status.js --print-statuses=unstarted | node -r esm --max-old-space-size=12000 v5

upload:
	node status.js --print-statuses=transformed | node -r esm v6

clean:
	node status.js --print-statuses=all | node clean.js

