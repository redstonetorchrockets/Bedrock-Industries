let serverSystem = server.registerSystem(0, 0);

let globals = {
    dummy: null
};
let firstPlayer;
serverSystem.initialize = function() {
    //register event data, register components, register queries, listen for events
    this.listenForEvent("bedrockindustries:player_looking", (eventData) => this.onPlayerLooking(eventData));
    this.registerEventData("bedrockindustries:looking_info", { block: null, player: null });
}

serverSystem.update = function() {

}

serverSystem.onPlayerLooking = function(eventData) {
    let entity = eventData.data.player;
    let blockPosition = eventData.data.coords;

    let tickingArea = serverSystem.getComponent(entity, "minecraft:tick_world").data.ticking_area;

    let block = serverSystem.getBlock(tickingArea, blockPosition);

    let blockId = block.__identifier__;
    let broadcastData = serverSystem.createEventData("bedrockindustries:looking_info");
    broadcastData.data.block = blockId;
    broadcastData.data.player = entity;
    serverSystem.broadcastEvent("bedrockindustries:looking_info", broadcastData);
}

serverSystem.onPick = function(eventData) {
    this.runCommand("say Heyh");
};

serverSystem.runCommand = function(command) {
    commandData = this.createEventData("minecraft:execute_command")
    commandData.data.command = command
    this.broadcastEvent("minecraft:execute_command", commandData)
}

serverSystem.sendMsg = function(msg) {
    let message = this.createEventData("minecraft:display_chat_event");
    message.data.message = msg;
    serverSystem.broadcastEvent("minecraft:display_chat_event", message);
};