
module.exports = {
    name: 'roles',
    addRole(msg, args) {
        const role = msg.guild.roles.cache.find(role => role.name === '7ds');
        if(!msg.guild.roles.cache.find(role => role.name === '7ds')) return msg.channel.send('Please add the 7ds role');
          
        if (args[0]) {
          if(msg.guild.owner.user.id !== msg.author.id) return msg.channel.send('Please add the 7ds role');

          const name = args[0]
          
          if(!msg.guild.members.cache.find(x => x.user.username === name)){
            msg.channel.send('That person doesnt exist on the server please try again');
          } else {
            const member = msg.guild.members.cache.find(x => x.name === name);
            if(member.roles.cache.find(x=> x.name === role.name)) return;
            member.roles.add(role);
            msg.channel.send(`${member.name} has been added`);
            
          }
        } else {
          if(msg.member.roles.cache.find(x => x.name === role.name)) return msg.channel.send('You are already on the role');
        
          msg.member.roles.add(role);
          msg.channel.send(`${msg.author.username} was added to 7ds role`);
        }
          return
    },
    removeRole(msg, args) {
      const role = msg.guild.roles.cache.find(role => role.name === '7ds');
      if(!msg.guild.roles.cache.find(role => role.name === '7ds')) return msg.channel.send('Please add the 7ds role');
      
      if (args[0]) {
        msg.channel.send('You do not have permission to remove someone else');
      } else {
        if(!msg.member.roles.cache.find(x => x.name === role.name)) {
          msg.channel.send('You have already been removed from the role');
          return
        }
        msg.member.roles.remove(role);
        msg.channel.send(`${msg.author.username} was removed from 7ds role`);
      }
    }
}