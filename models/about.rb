module AboutModification
  def admins
    @admins ||= User.where(admin: true)
      .where.not(id: Discourse::SYSTEM_USER_ID)
      .where.not(username_lower: 'jono.brain')
      .human_users
      .order("last_seen_at DESC")
  end
end

require_dependency 'about'
class ::About
  prepend AboutModification
end