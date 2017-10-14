<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205402_rbac_auth_item_child extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%rbac_auth_item_child}}',
            [
                'parent'=> $this->string(64)->notNull(),
                'child'=> $this->string(64)->notNull(),
            ],$tableOptions
        );
        $this->createIndex('child','{{%rbac_auth_item_child}}','child',false);
    }

    public function safeDown()
    {
        $this->dropIndex('child', '{{%rbac_auth_item_child}}');
        $this->dropTable('{{%rbac_auth_item_child}}');
    }
}
