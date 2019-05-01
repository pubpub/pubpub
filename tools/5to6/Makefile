.phony:
	transform upload clean

transform:
	node status.js --print-status=unstarted | node -r esm --max-old-space-size=12000 v5

upload:
	node status.js --print-status=transformed | node -r esm --max-old-space-size=12000 v6

clean:
	node status.js --print-status=all | node clean.js

